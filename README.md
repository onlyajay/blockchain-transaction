# blockchain-transaction

## Installation

Blockchain-transaction requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and start the server.

```sh
cd blockchain-transaction
npm i
npm run start
```

## API Details

### Get transaction ancestor count
```http
GET /get-transaction/:height
```
#### Path params
| Parameter | Type      | Description                      |
|:----------|:----------|:---------------------------------|
| `height`    | `integer`  | **Required**. Block height       |


#### Sample Responses

```javascript
{
    "51002e3d9ecae2ec5bb9f174e6a16bad6fab4a8f1ab95a383f757fa8d49d31c1": 656,
    "297c06e3ea9a22bf23328eadff6b709d5df6af85425629335e407776851abece": 625,
    "1fdd5ba3a5ca794463046d533da02d346ef8f266af2eb8cf20552032f6d11f1e": 583,
    "f17d3410c8bc07d514c9b54ca57857c45a0f1c40a118ce20f30d72a1f6e91240": 555,
    "cffacf4cd684147dee7451337d220742bccefa4aa578cee780d5b8299820ebfb": 547,
    "961895036ae057453acd925642d2532f63ab2886c7669aed379669dccdde502b": 470,
    "aa272ccf1aaa1c4b3ffed4ed00f2056eac0e81f618c79057dc654d7fc56ad0a3": 259,
    "a84662e589229ada9dc8bd910d60a1e61912b2b6da768df305b0507340c1135a": 221,
    "a3dd34f96a50416ee9972423c1525c757217879b222acfef28846f0124776fd2": 179,
    "26e2f4f7cbd65b582761657b226afa4ffa6cbd61867049b23af3fe69f72430f7": 165
}
```