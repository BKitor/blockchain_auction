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

    def test_user_create(self):
        url = '/newuser/'
        p_data = {
            'username': 'test_user_nametst3',
            'wallet': '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
            'password': 'insacure',
        }
        res = self.client.post(url, p_data)
        res_j = res.json()

        u = User.objects.get(username=p_data['username'])
        p = Profile.objects.get(user=u)

        self.assertEqual(p_data['wallet'], p.wallet)
        self.assertEqual(p_data['wallet'], res_j['wallet'])
        self.assertEqual(p_data['username'], p.user.username)
        self.assertEqual(p_data['username'], res_j['username'])

    def test_username_taken(self):
        url = '/newuser/'
        p_data = {
            # 'email': 'nope@nope.com',
            # 'first_name': 'null',
            # 'last_name': 'null',
            'password': 'insacure',
            'username': 'admin',
            'wallet': '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
            # 'birthday': '',
        }
        res = self.client.post(url, p_data)
        res_j = res.json()
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res_j['message'], "Username is taken")

    def test_profile_post(self):
        url = '/profile/'
        self._auth()

        p_data = {
            'email': 'tst@tst.tst',
            'first_name': 'tst',
            'username': 'test_user_nametst',
            'last_name': 'tst',
            'wallet': 'jkl;sadfl;jkasdf',
            'birthday': '6666-06-06',
            'publicProfile': True,
            'password': 'insacure',
        }
        response = self.client.post(url, data=p_data)
        res_j = response.json()

        p_data2 = {
            'email': 'nope@nope.com',
            'first_name': 'null',
            'last_name': 'null',
            'username': 'test_user_nametst2',
            'wallet': '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
            'birthday': '',
            'password': 'insacure',
        }
        response2 = self.client.post(url, data=p_data2)
        res2_j = response2.json()

        self.assertEqual(res_j['wallet'], p_data['wallet'])
        self.assertEqual(res_j['username'], p_data['username'])

        self.assertEqual(res2_j['wallet'], p_data2['wallet'])
        self.assertEqual(res2_j['username'], p_data2['username'])
        self.assertEqual(res2_j['wallet'], p_data2['wallet'])
        self.assertEqual(res2_j['username'], p_data2['username'])

    def test_profile_put(self):
        url = '/profile/1/'
        self._auth()

        old_pw = Profile.objects.get(user=1).user.password

        p = self.client.get(url).data
        p['wallet'] = 'updated_wallet'
        p['first_name'] = 'updated_fname'
        p['password'] = 'blanktext'
        self.client.put(url, data=p)

        p_o = Profile.objects.get(user=p['user_id'])
        self.assertEqual(p['wallet'], p_o.wallet)
        self.assertEqual(p['first_name'], p_o.user.first_name)
        self.assertEqual(p_o.user.password, old_pw)

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
