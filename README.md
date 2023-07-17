# Polygon API

## The source code for the API of the game POLYGON

I did this project to improve my programming and API skills. The project is still not fully done yet. 

## How does it work?

First you will need an apikey. I still haven't implemented a way to get one so I'll move on for now.<br>
You can check if the apikey is correct by typing in "localhost:5000/api/v1/<key>/ in your browser.<br>
This will return <br>
{<br>
  "data": [],<br>
  "message": "Apikey correct",<br>
  "success": 1<br>
}<br>
when the key is correct. Else it will return <br>
{<br>
  "data": [],<br>
  "message": "Apikey invalid or incorrect",<br>
  "success": 0<br>
}<br>
or <br>
{<br>
  "data": [],<br>
  "message": "Max calls reached",<br>
  "success": 0<br>
}<br>
when wrong.

To get the data of every weapon you type in "localhost:5000/api/v1/key/weapons" and it will show you every weapon there is in the game.<br>
To get information about a specific weapon you type in "localhost:5000/api/v1/key/weapons/code" and it will show you the weapon you searched for through the code. <br>
The code is the name of the object without spaces and "-".

Here is every possible url listed:

All weapons: "localhost:5000/api/v1/key/weapons/"<br>
Specific weapon: "localhost:5000/api/v1/key/weapons/code/"

All modules: "localhost:5000/api/v1/key/modules/"<br>
Every module of a specified type: "localhost:5000/api/v1/key/modules/type/"<br>
Specific module: "localhost:5000/api/v1/key/modules/type/code/

All cosmetics: "localhost:5000/api/v1/<key>/cosmetics"<br>
Every cosmetic of a specified type: "localhost:5000/api/v1/key/cosmetics/type/"<br>
Specific cosmetic: "localhost:5000/api/v1/key/cosmetics/type/code/"


I will make a more detailed README when it's fully done.
