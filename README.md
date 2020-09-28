# Blockchain Auction
Capstone project

# Setup
### This setup assumes you've got WSL/Ubuntu or some other type of Linux set up, if you don't you can follow Microsoft's docs to set up WSL: https://docs.microsoft.com/en-us/windows/wsl/install-win10

&nbsp;

Before we can get started, you need to make sure both Node.js and Python work

## Installing Node

Before installing new components, we should make sure that existing components are up to date. Run:

`sudo apt update`

`sudo apt upgrade`

And say yes when prompted to. 

Next, start by installing nvm (Node Version Manager)

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

***Restart your terminal*** so that changes can take effect.
In a new terminal type `nvm --version` and you should get a version output, something along the lines `0.35.3`

next install node, run: 

`nvm install node`

Once this is done both Node and npm (Node Package Manager) should be installed.
To verify you can run `node --version` and `npm --version`.
You should get versions similar to `v14.11.0` and `6.14.8`.

## Installing Python

On Ubuntu both python2 and python3 come preinstalled, this project will use Python3.
If you want to check your install, run `python3 --version` you should get an output similar to `3.8.2`.

You will need to make a virtual environment, install the venv tool from apt. 

`sudo apt install -y python3-venv`

To check if it's installed, you can run `python3 -m venv -h` and it should display a help message for making virtual environments. 


## Cloning Blockchain Auction

Now go we can clone the repo. This is going to create a directory called blockchain_auction
in you're current directory that will contain the project. Since this is a private repo, we will need a GitHub personal access token. 

On github.com, go to Settings->Developer Settings(At the botom)->Personal Access Tokens->
Generate New Token. Give it a name, and **enable all options** for the token. Click Generate Token, this should produce a long string of characters.  

Back in your terminal, clone the repo

`git clone https://github.com/BKitor/blockchain_auction.git`

This should prompt you for a username and password. The username is your github Username, and **the password is the token you just generated**

If it works, you there should be a `blockchain_auction` directory. (run `ls`). Navigate to blockchain_auction (`cd blockchain_auction`) and run the following 2 commands:

`git config credential.helper store`

`git pull`

This should store your credentials to disk, so that you don't have to keep reentering them
whenever you're interacting with GitHub. 

## Running Blockchain Auction

Now we should be good to go! Just install dependencies and run both servers!
You're going to need two terminals for this. 

In the first terminal, were gonna run the frontend Vue.js Server:

`cd bca_vue`

`npm install` // This installed node dependencies in a file called `node_modules`

`npm run dev`

Leave the first window open and in the second Terminal, set up and run the Python Django server:

`python3 -m venv venv` //This creates the virtual environment and stores it in a file called `venv`

`source venv/bin/activate` // This activates the virtualenvironment

`pip install -r requirements.txt` // This installs dependencies in `venv`

`cd bca_django`

`python manage.py migrate`  // This initialises the database, it should create `db.sqlite3`

`python manage.py runserver`

Go to http://localhost:8080 in your browser, and you should see two buttons

## Running Blockchain Auction Later

The next time you want to run the development environment, you can skip the steps setting up pip/npm:

Window 1:

`npm run dev`

Window 2:

`source venv/bin/activate` 

`cd bca_django`

`python manage.py runserver`


### If you have any question don't hesitate to ask me on Discord or Facebook or whatever. If something doesn't work, let me know, I'll help you fix it. 


