from django.test import TestCase, Client


class SalesAPITest(TestCase):
    """Basic tests for the sales API endpoint using Django TestCase and client."""

    def setUp(self):
        self.client = Client()

    def test_sales_api_returns_results(self):
        response = self.client.get('/sales/api/')
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Basic shape assertions
        self.assertIn('results', data)
        self.assertIsInstance(data['results'], list)

        # If results exist, assert expected fields on first item
        if data['results']:
            item = data['results'][0]
            self.assertIn('id', item)
            self.assertIn('product', item)
            self.assertIn('amount', item)
