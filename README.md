
	      ____                  __          ____
	     / __ \____  _____ ____/ /_  ____  / / /_
	    / /_/ / __ `/ ___/ ___/ __ \/ __ \/ / __/
	   / ____/ /_/ (__  |__  ) /_/ / /_/ / / /_
	  /_/    \__,_/____/____/_.___/\____/_/\__/

	Open source password manager for teams
	(c) 2016 Bolt Softwares Pvt Ltd


Legal
===============================

Copyright 2016 Bolt Softwares Private Limited

Licence: http://www.gnu.org/licenses/agpl-3.0.en.html

Credits: https://www.passbolt.com/credits


How to get started?
===============================

This is still a work in progress so the application is not available on NPM just yet.
But you can easily try out! Bear with us! :)

Copy the repository
```
git clone git@github.com:passbolt/passbolt_cli.git

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
cp config.default.json
```

You can look at the examples in the config folder.
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

What commands do to you support?
================================

Right now the basics, only authentication and read operations.
```
  Usage: passbolt [options] [command]


  Commands:

    auth        Authentication actions, login or logout
    users       Find one or more users
    get         View the OpenPGP data block of a given resource
    find        Find one or more resources
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```


Authentication
---------------
Authentication is based on (GPGAuth)[https://www.passbolt.com/help/tech/auth], so it uses your private key
and your passphrase if you have one.

You can provide your passphrase or let GPG handle the prompt.
```
$ passbolt auth -p ada@passbolt.com
GPGAuth Skipping, you are already logged in
```

You can also logout. If let say you change your user config, or want to clear your session.
```
$ passbolt auth logout
```

List the users
---------------
```
$ passbolt users

FIRST NAME           LAST NAME            USERNAME              FINGERPRINT                              UUID
Frances              Allen                frances@passbolt.com  98DA33350692F21BD5F83A17E8DC5617477FB14C 1c137bd7-2838-3c3d-a021-d2986d9126f5
Kathleen             Antonelli            kathleen@passbolt.com 14D07AFFDE916BC904F17AFB4D203642A73AE279 201b442c-d6ca-3ee6-a443-ce669ca0ec6e
Jean                 Bartik               jean@passbolt.com     8F758E3BDD8445361A8A6AD073BAC28524AA1193 7c7afd29-1b98-3c3e-ae55-adedc333fb4b
...
```

Find a password
---------------
```
$ passbolt find

NAME                            USERNAME             URI                                     MODIFIED             UUID
Inkscape                        vector               https://inkscape.org/                   2016-05-15 16:04:49  17c66127-0c5e-3510-a497-2e6a105109db
Enlightenment                   efl                  https://www.enlightenment.org/          2016-05-15 16:04:49  2af40344-b330-30a8-ac26-64b2776f07e0
free software foundation europe fsfe                 https://fsfe.org/index.en.html          2016-05-15 16:04:49  31bf093f-dd27-391d-ae9d-f511ef41dd12
ftp                             user                 ftp://192.168.1.1                       2016-05-15 16:04:49  4a2f98e8-b326-3384-aa2b-c3c9a81be3f7
...
```

Get the encrypted password
--------------------------

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


Putting it all together
--------------------------

Of course you can chain and pipe things up like:
```
$ passbolt get $(passbolt find | grep inkscape | awk '{print $6}') > secret.gpg; gpg --decrypt secret.gpp
```
