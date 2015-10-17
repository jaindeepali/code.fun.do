from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.template import Context, loader, Template
import json
import requests
import urllib

@csrf_exempt
def classify(request):	
	inp = request.POST
	text = inp['text']
	text = text.encode('ascii', 'ignore')
	
	data = {
		'text_list' : [text]
	}
	response = requests.post(
	    "https://api.monkeylearn.com/v2/classifiers/cl_oFKL5wft/classify/?",
	    data=json.dumps(data),
	    headers={'Authorization': 'Token 1569c380f608e8bd6610360be707dce71c7dcb6a',
            'Content-Type': 'application/json'})
	response = json.loads(response.text)
	res1 = response.get('result', '')

	args = {}
	args['readkey'] = 's7Rr3yE0GSvf'
	args['text'] = text
	args['output'] = 'json'
	args['version'] = '1.01'
	args = urllib.urlencode(args)
	url = "http://uclassify.com/browse/uClassify/Topics/ClassifyText?%s" % args
	r = urllib.urlopen(url)
	response = json.loads(r.read())
	res2 = response.get('cls1', "")
	result = {'1':res1,'2':res2}
	return JsonResponse(result)