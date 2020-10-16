from rest_framework.test import APITestCase
from requests.auth import HTTPBasicAuth

# Create your tests here.


class ProfileTests(APITestCase):

    fixtures = ['user_fixture']

    def test_profile_get(self):
        url = '/profile/1/'
        self.client.login(username='admin', password='Passw0rd')
        response = self.client.get(url) 
        self.assertEqual(response.data['wallet'], 'dkrigjdk')
        response_2 = self.client.get(response.data['user'])
        self.assertEqual(response_2.data['username'], 'admin')

    def test_profile_post(self):
        url = '/profile/'
        self.client.login(username='admin', password='Passw0rd')
        response = self.client.post()