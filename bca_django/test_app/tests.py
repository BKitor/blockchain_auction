from rest_framework.test import APITestCase
from django.contrib.auth import hashers
# Create your tests here.


class ProfileTests(APITestCase):

    fixtures = ['user_fixture']

    def test_profile_get(self):
        url = '/profile/1/'
        self.client.login(username='admin', password='Passw0rd')
        response = self.client.get(url)
        self.assertEqual(response.data['wallet'], 'dkrigjdk')
        self.assertEqual(response.data['username'], 'admin')

    def test_profile_post(self):
        url = '/profile/'
        self.client.login(username='admin', password='Passw0rd')

        new_p_data = {
            'email': 'tst@tst.tst',
            'first_name': 'tst',
            'username': 'test_user_nametst',
            'last_name': 'tst',
            'wallet': 'jkl;sadfl;jkasdf',
            'birthday': '6666-06-06',
            'publicProfile': True,
        }

        response = self.client.post(url, data=new_p_data)
        self.assertEqual(response.data['wallet'], new_p_data['wallet'])
        self.assertEqual(response.data['username'], new_p_data['username'])
