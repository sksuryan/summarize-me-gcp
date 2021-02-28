import os
from pydub import AudioSegment
from google.cloud import speech, storage
from werkzeug.utils import secure_filename
from process import generate_summary, keyword_processing

def saveVideo(file, uploadFolderPath):
  filename = secure_filename(file.filename)

  path = os.path.join(uploadFolderPath, filename)
  file.save(path)

  return path

def convertToWav(videoPath,ext):
  dst = "converted.wav"

  sound = AudioSegment.from_file(videoPath,ext)
  sound = sound.set_channels(1)

  sound.export(dst, format="wav")

def saveToBucket():
  BUCKET_NAME = os.environ.get('BUCKET_NAME')
  
  client = storage.Client()
  bucket = client.get_bucket(BUCKET_NAME)

  blob = bucket.blob('results.wav')
  blob.upload_from_filename('converted.wav')

def deleteFromBucket():
  BUCKET_NAME = os.environ.get('BUCKET_NAME')
  
  client = storage.Client()
  bucket = client.get_bucket(BUCKET_NAME)

  blob = bucket.blob('results.wav')
  blob.delete()

def processAudio():
  BUCKET_NAME = os.environ.get('BUCKET_NAME')
  GCS_URI = f'gs://{BUCKET_NAME}/results.wav'

  saveToBucket()

  client = speech.SpeechClient()
  audio = speech.RecognitionAudio(uri=GCS_URI)

  config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    language_code="en-US",
    enable_word_time_offsets=True,
  )

  operation = client.long_running_recognize(config=config, audio=audio)
  response = operation.result()

  deleteFromBucket()

  return response.results
  

def processResults(results):
  processedResults = {}
  processedResults['transcript'] = ''
  
  wordStamps = {}
  keywords = []
  keywordsWithStamps = {}

  for result in results:
    alternative = result.alternatives[0]

    text = processedResults['transcript']

    processedResults['transcript'] = f'{text} {alternative.transcript}'

    for wordStamp in alternative.words:
      word = wordStamp.word
      word = word.lower()
      timestamp = wordStamp.start_time.seconds

      if word not in wordStamps.keys():
        wordStamps[word] = []
      
      wordStamps[word].append(timestamp)

  returnedKeywords = keyword_processing(processedResults['transcript'])
  
  for keyword in returnedKeywords:
    keyword = keyword.lower()
    splitWords = keyword.split()
    keywords.extend(splitWords)
  
  for keyword in keywords:
    if keyword not in keywordsWithStamps.keys():
      if keyword in wordStamps.keys():
        keywordsWithStamps[keyword] = wordStamps[keyword]

  processedResults['keywords'] = keywordsWithStamps

  #get summary
  processedResults['summary'] = generate_summary(processedResults['transcript'])

  return processedResults


def startProcessing(file, uploadFolderPath):
  _, ext = os.path.splitext(file.filename)
  ext = ext[1:]

  #saves the file locally
  path = saveVideo(file, uploadFolderPath)

  #converting the file
  sampleRate = convertToWav(path,ext)

  #processing the audio
  results = processAudio()

  #extract details
  processedResults = processResults(results)

  return(processedResults)

  