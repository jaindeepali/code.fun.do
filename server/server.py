from flask import Flask
from flask_restful import Resource, Api, reqparse
import os
import json
import requests
import urllib

app = Flask(__name__)
api = Api(app)

class GetCategories(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('name', type=str, help='Name of the file')
			parser.add_argument('text', help='Content of the file')
			req_args = parser.parse_args()
			name = req_args['name']
			text = req_args['text']

			data = {"text_list" : [text]}
			data = json.dumps(data)
			response = requests.post(
				"https://api.monkeylearn.com/v2/classifiers/cl_oFKL5wft/classify/?",
				data = data,
				headers = {'Authorization': 'Token 1569c380f608e8bd6610360be707dce71c7dcb6a',
				'Content-Type': 'application/json'})
			response = json.loads(response.text)

			res1 = response.get('result', '')[0]
			tags = [item['label'] for item in res1]

			args = {}
			args['readkey'] = 's7Rr3yE0GSvf'
			args['text'] = text
			args['output'] = 'json'
			args['version'] = '1.01'
			response = requests.get(
				"http://uclassify.com/browse/uClassify/Topics/ClassifyText?%s",
				data = args)
			response = json.loads(response.text)
			res2 = response.get('cls1', "")
			res2 = sorted(res2, key=res2.get, reverse=True)
			result = {}
			result['success'] = 1
			result['name'] = name
			result['tags'] = tags
			result['folder_name'] = res2[0]
			result['text'] = text
			return result

		except Exception as e:
			return {'error': str(e)}

api.add_resource(GetCategories, '/GetCategories')

if __name__ == '__main__':
	app.run(debug=True)
