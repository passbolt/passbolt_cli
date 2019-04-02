
	      ____                  __          ____
	     / __ \____  _____ ____/ /_  ____  / / /_
	    / /_/ / __ `/ ___/ ___/ __ \/ __ \/ / __/
	   / ____/ /_/ (__  |__  ) /_/ / /_/ / / /_
	  /_/    \__,_/____/____/_.___/\____/_/\__/

	Open source password manager for teams
	(c) 2019 Passbolt SA

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but without any warranty; without even the implied warranty of
merchantability or fitness for a particular purpose.  See the
GNU Affero General Public License for more details.

[Affero General Public License v3](http://www.gnu.org/licenses/agpl-3.0.html)

# What is the purpose of this repository

This repository is a command line interface for passbolt API.
It allows a user to interact with the passbolt server without the user of web extension.
Currently works as a read only access only.

# How to get started?

Copy the repository
```
git clone git@github.com:passbolt/passbolt_cli.git
```

Move inside the new directory
```
cd passbolt_cli
```

Install npm dependencies
```
npm install
```

Make the symlink on our path point to the index.js
```
[sudo] npm link
```

Create or copy a configuration file with a user and a server config
```
cd app/config
cp config.default.json config.json
```

Open the newly created config file and set the details.
You can look at the examples in the config folder.

# Configuration
## Domain config
You need to setup the domain `baseUrl`, and the associated key `fingerprint`
You also need to make sure the server public key is in your GnuPG keyring.

If you do not know the domain public key or fingerprint you can get them like follow
```
$ passbolt keyring server-public-key --display-fingerprint
$ passbolt keyring server-public-key --display-armored
```

## User config
You will need to download your private key from the passbolt interface, for example
during the backup step of the setup, or once logged on your profile workspace.

Import this key in your GnuPG keyring and get a hold of the fingerprint.
Set all the information in the `user` section of the configuration file.

## Example configuration
If you are using a default passbolt server instance with Selenium tests data installed then it will work out the box
with Ada for example:
```
{
  "domain" : {
    "baseUrl": "http://passbolt.dev",
    "publicKey" : {
      "fingerprint" : "2FC8945833C51946E937F9FED47B0811573EE67E"
    }
  },
  "user" : {
    "firstname": "Ada",
    "lastname" : "Lovelace",
    "email" : "ada@passbolt.com",
    "privateKey" : {
      "fingerprint": "03F60E958F4CB29723ACDF761353B5B15D9B054F"
    }
  }
}
```

## Additional settings
Some additional options are available:

###  Gpg trust

You can define the trust model when encrypting:
```
  "gpg" : {
    "trust": "always"
  }
```

### Working with self signed certificates

By default SSL request will be refused for a connection which is not authorized with the list of 
supplied CAs. *For testing purposes* you can set rejectUnauthorized to false, to ignore issues 
with the certificate (authority, not matching names, etc).

Please [review other options](https://github.com/request/request#using-optionsagentoptions) 
that allow finer and safer control for self signed certificate, see. 
```
  "agentOptions": {
    "rejectUnauthorized": false
  }
```

### Mfa preferences

It is possible to set the order of preference for MFA providers if MFA is setup and requested.
With this configuration if Yubikey and TOTP providers are both enabled for the organization and the user,
yubikey OTP will be used as MFA. If it is not enabled for the organization for example, it will fall back
to Totp.
```
  "mfa": {
    "providers": ["yubikey","totp"]
  },
```

# What commands do to you support?

Right now the basics, only authentication and read operations.
```
  Usage: passbolt [options] [command]


  Commands:

    auth        Authentication actions, login or logout
    get         View the OpenPGP data block of a given resource
    find        Find one or more resources
    keyring     Synchronize public keys
    users       List all users
    user        List information for a given user
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Authentication
Authentication is based on [GPGAuth](https://www.passbolt.com/help/tech/auth), so it uses your private key
and your passphrase if you have one.

You can provide your passphrase or let GPG handle the prompt.
```
$ passbolt auth login -p ada_password

GPGAuth Skipping, you are already logged in
```

You can also logout. If let say you change your user config, or want to clear your session.
```
$ passbolt auth logout
```

You can check if you are logged in or not.
```
$ passbolt auth check
```

## Find a password
```
$ passbolt find

NAME                            USERNAME             URI                                     MODIFIED             UUID
Inkscape                        vector               https://inkscape.org/                   2016-05-15 16:04:49  17c66127-0c5e-3510-a497-2e6a105109db
Enlightenment                   efl                  https://www.enlightenment.org/          2016-05-15 16:04:49  2af40344-b330-30a8-ac26-64b2776f07e0
free software foundation europe fsfe                 https://fsfe.org/index.en.html          2016-05-15 16:04:49  31bf093f-dd27-391d-ae9d-f511ef41dd12
ftp                             user                 ftp://192.168.1.1                       2016-05-15 16:04:49  4a2f98e8-b326-3384-aa2b-c3c9a81be3f7
...
```
Your can select the columns you want to display using the `--columns` arguments.

```
$ passbolt find --columns=name,uuid
```

## Get the encrypted password

Once you know the UUID from the find you can get it as follow
```
$ passbolt get 664735b2-4be7-36d9-a9f8-08d42998faf8
-----BEGIN PGP MESSAGE-----
Version: GnuPG v2

hQIMA1P90Qk1JHA+ARAAmp59nJOyb4awNBo9x32Vn01ggw77571EGjnBA0gOXwQD
+mANJj9YiU9Wx8vM77WuUo8o7O5uXzf6mpo/QgK1pyoNl0nOviAYUoKdTuC2dUKG
5eS8DUb4SA/XDlOSywkRkRdwDm/BlQvfWCFPqX1kacivBa3RBR2tuojGMSw0sjAq
zUZZ5iDIMMUhvCzgALcAr84NaUfB5Tb1VLArVDadGx5/qzGFCa2Fris+mBq2dVuk
X0Jy+jmWXaob2EDjVm49rcKrMWbHDtmWKl4eAJZnGWrhsOT1PBikSXQorILLdkjD
VFCSX4a8hK6SeWO49fwC/Q8NBCx7at3zvstrie+aoQe/gMQhcHTUu64z/hBhCNww
JhxfyTdLGHq9j7jPkUPgkw135SvYpeY4Nzk70/hc7tDD0EYDlgVtTNdTiVYVliHN
GQ4qkjwIog7WQy0FQ+DaA6+WANVpVDfjODUzLwr5ef7ZkfWe0XkfG0oRSyIfui9d
gsuoTc74n61T9dTxx/Vp9uPU7nLR+mRRSuXqy/tdinI7jEN5f2i98ikX+OxU5QIv
M+xLWLKKWY+hjUcb1z36UhTi2D5TeW4GL7QEcpT/mteNw3gHPBkjECdKg8mOSXE7
li6NsKABJ+I3013ibQKL360HH22tCdlMYGPSQjOwjafy2Uiyid1w8+TAoRAwlmnS
QQFAaEJ7c2o2BO5cLIVD/rhP/zJjAV1uUQnJwe6EExpMTL9Iw38MZj+q4VjfRw2q
INNhsjl+27LCiCNmH8RNvPce
=Bbft
-----END PGP MESSAGE-----
```

## Putting it all together

Of course you can chain and pipe things up like:

```
$ passbolt get $(passbolt find  | awk '/inkscape/ { print $NF }') | gpg -q --no-tty 
```

```
-q and --no-tty 
```
are optional and ensures that only the password is printed.
## Runnning the tests

```
$ [sudo] npm install -g mocha
$ mocha tests
```

## List the users
```
$ passbolt users

FIRST-NAME           LAST-NAME            USERNAME              FINGERPRINT                              UUID
Frances              Allen                frances@passbolt.com  98DA33350692F21BD5F83A17E8DC5617477FB14C 1c137bd7-2838-3c3d-a021-d2986d9126f5
Kathleen             Antonelli            kathleen@passbolt.com 14D07AFFDE916BC904F17AFB4D203642A73AE279 201b442c-d6ca-3ee6-a443-ce669ca0ec6e
Jean                 Bartik               jean@passbolt.com     8F758E3BDD8445361A8A6AD073BAC28524AA1193 7c7afd29-1b98-3c3e-ae55-adedc333fb4b
...
```

Your can select the columns you want to display using the `--columns` arguments.

```
$ passbolt users --columns=created,username
```

## Find a user
```
$ passbolt user 1c137bd7-2838-3c3d-a021-d2986d9126f5

FIRST NAME           LAST NAME            USERNAME              FINGERPRINT                              UUID
Frances              Allen                frances@passbolt.com  98DA33350692F21BD5F83A17E8DC5617477FB14C 1c137bd7-2838-3c3d-a021-d2986d9126f5
...
```
