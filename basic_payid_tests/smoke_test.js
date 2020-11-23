import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";
import crypto from "k6/crypto";

export let errorRate = new Rate("errors");
const host='petitprince-9.luxembourg.grid5000.fr'
export let options = {
     vus: 1, // 1 user looping for 1 second
     duration: '30s',
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
