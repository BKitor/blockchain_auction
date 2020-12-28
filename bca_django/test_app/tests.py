from rest_framework.test import APITestCase
from django.contrib.auth import hashers
from test_app.models import Profile, SealedBid
from rest_framework.authtoken.models import Token
from test_app.models import User

# Create your tests here.


class ProfileTests(APITestCase):

    fixtures = ['user_fixture']

    def _auth(self):
        t = self._get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {t}')

    def _get_token(self):
        url = '/api-token-auth/'
        data = {
            'username': 'admin',
            'password': 'Passw0rd',
        }
        return self.client.post(url, data).json()['token']

    def test_token_auth(self):
        url = '/api-token-auth/'
        data = {
            'username': 'admin',
            'password': 'Passw0rd',
        }
        res = self.client.post(url, data)
        self.assertIn("token", res.json())

    def test_profile_get(self):
        url = '/profile/1/'
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.data['username'], 'admin')

    def test_profile_post(self):
        url = '/profile/'
        self._auth()

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

    def test_profile_put(self):
        url = '/profile/1/'
        self._auth()

        p = self.client.get(url).data
        p['wallet'] = 'updated_wallet'
        p['first_name'] = 'updated_fname'
        self.client.put(url, data=p)

        p_o = Profile.objects.get(user=p['user_id'])
        self.assertEqual(p['wallet'], p_o.wallet)
        self.assertEqual(p['first_name'], p_o.user.first_name)

    def test_get_p_by_uname(self):
        url = '/profile/uname/admin/'
        self._auth()

        j = self.client.get(url).json()
        self.assertIn('url', j)
        self.assertEqual('admin', j['username'])


# Sealed bid tests
class SealedBidTests(APITestCase):

    fixtures = ['user_fixture']

    def _auth(self):
        t = self._get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {t}')

    def _get_token(self):
        url = '/api-token-auth/'
        data = {
            'username': 'admin',
            'password': 'Passw0rd',
        }
        return self.client.post(url, data).json()['token']

    def test_sealedBid_get(self):
        url = '/auction/1/'
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.data['auction_id'], 'sdfkj3')

    def test_sealedBid_post(self):
        url = '/auction/'
        self._auth()

        new_p_data = {
            'owner': 1,
            'end_time': '6566-06-06T08:15-05:00',
            'auction_id': '49849837',
            'min_bid': 3,
            'item_description': 'this is a test item 2',
        }

        response = self.client.post(url, data=new_p_data)
        self.assertEqual(response.data['auction_id'], new_p_data['auction_id'])

    def test_sealedBid_put(self):
        url = '/auction/'
        self._auth()

        new_p_data = {
            'owner': 1,
            'end_time': '',
            'auction_id': '',
            'min_bid': 3,
            'item_description': 'this is a test item 2',
        }

        response = self.client.post(url, data=new_p_data)
        self.assertEqual(response.data['auction_id'], '')

        new_p_data['auction_id'] = 'lksdfjdflk'
        new_p_data['end_time'] = '7566-07-06T08:15-05:00'
        response = self.client.put(response.data['url'], data=new_p_data)
        self.assertEqual(response.data['auction_id'], 'lksdfjdflk')
        self.assertEqual(response.data['end_time'], '7566-07-06T13:15:00Z')

    def test_start_auction(self):
        url = '/auction/1/start_auction'
        self._auth()
        self.client.put(url)
