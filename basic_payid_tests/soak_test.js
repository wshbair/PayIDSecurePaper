import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";
import crypto from "k6/crypto";

export let errorRate = new Rate("errors");
const host='127.0.0.1'
export let options = {
    stages: [
        { duration: '2m', target: 400 }, // ramp up to 400 users
        { duration: '30m', target: 400 }, // stay at 400 for ~4 hours
        { duration: '2m', target: 0 }, // scale down. (optional)
      ]
  };

  export default function() {	 
    var url = "http://"+host+":8081/users";
    var readURL="http://"+host+":8080/";
    var readParams = {
        headers:  {
            "PayID-Version":"1.0",
            "Accept": "application/xrpl-testnet+json"
        }
      }; 
    var params = {
        headers:  {
           "Content-Type": "application/json",
           "PayID-API-Version": "2020-06-18",
        }
      }; 
      var id= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
      var data = JSON.stringify(
        {
            "payId":id+"$"+host,
            "identityKey": "",
            "addresses": [
                {
                "paymentNetwork": "BTC",
                "environment": "TESTNET",
                "details": {
                    "address": "mxNEbRXokcdJtT6sbukr1CTGVx8Tkxk3DB"
                }
                }
            ],
            "verifiedAddresses": [
                {
                "paymentNetwork": "XRPL",
                "environment": "TESTNET",
                "details": {
                    "address": "TVQWr6BhgBLW2jbFyqqufgq8T9eN7KresB684ZSHKQ3oDth"
                },
                "identityKeySignature":
                    "d2hhdCBhbSBJIGNvZGluZyB3aGF0IGlzIGxpZmUgcGxlYXNlIGhlbHA="
                }
            ]
    }
      );
      check(http.post(url, data, params), { "Create successfully": (r) => r.body == 'Created' }) 
      check(http.get(readURL+id,readParams), {"Read Successfully": (r) => r.status == 200})
      sleep(1);
};