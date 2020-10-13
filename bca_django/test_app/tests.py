from rest_framework.test import APITestCase
from requests.auth import HTTPBasicAuth

# Create your tests here.


class UserTests(APITestCase):

    fixtures = ['user_fixture']

    def test_user_get(self):
        url = '/users/1/'
        self.client.login(username='admin', password='Passw0rd')
        response = self.client.get(url)
        print(response)
        print(response.data)
        self.assertEqual(response.data['username'], 'admin')
        self.assertEqual(response.data['username'], 'notadmin')

