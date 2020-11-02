from rest_framework.test import APITestCase
from django.contrib.auth import hashers
from test_app.models import Profile, SealedBid
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

    def test_profile_put(self):
        url = '/profile/1/'
        self.client.login(username='admin', password='Passw0rd')

        p = self.client.get(url).data
        p['wallet'] = 'updated_wallet'
        p['first_name'] = 'updated_fname'
        self.client.put(url, data=p)

        p_o = Profile.objects.get(user=p['user_id'])
        self.assertEqual(p['wallet'], p_o.wallet)
        self.assertEqual(p['first_name'], p_o.user.first_name)


#Sealed bid tests
class SealedBidTests(APITestCase):

    fixtures = ['user_fixture']

    def test_sealedBid_get(self):
        url = '/profile/1/'
        self.client.login(username='admin', password='Passw0rd')
        response = self.client.get(url)
        self.assertEqual(response.data['wallet'], 'dkrigjdk')
        self.assertEqual(response.data['username'], 'admin')

    def test_sealedBid_post(self):
        url = '/profile/'
        self.client.login(username='admin', password='Passw0rd')

        new_p_data = {
            #'email': 'test@tst.tst',
            #'first_name': 'test',
            #'username': 'test_user_nametest',
            #'last_name': 'test',
            'wallet': 'jkl;sadfl;jkasds',
            'end_time': '6566-06-06',
            'auction_id': '49849837',
            'min_bid': '5',
            'item_description': 'this is a test item',
            #'publicProfile': True,
        }

        response = self.client.post(url, data=new_p_data)
        self.assertEqual(response.data['wallet'], new_p_data['wallet'])
        self.assertEqual(response.data['username'], new_p_data['username'])

    def test_sealedBid_put(self):
        url = '/profile/1/'
        self.client.login(username='admin', password='Passw0rd')

        p = self.client.get(url).data
        p['wallet'] = 'updated_wallet'
        p['first_name'] = 'updated_fname'
        self.client.put(url, data=p)

        p_o = SealedBid.objects.get(user=p['user_id'])
        self.assertEqual(p['wallet'], p_o.wallet)
        self.assertEqual(p['first_name'], p_o.user.first_name)