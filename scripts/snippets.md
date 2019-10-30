#### Mapping port 3000 to 80 (optional)

To serve your application on the default port `80` (and therefore have the port number dissapear in the browser) instead of `3000`, you can use `nginx` in the following way (copied from [here](https://link.medium.com/MW5iaxQ96Z)):
```sh
sudo apt-get install nginx
sudo rm /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/fin4x
```
Paste this in:
```sh
server {
  listen 80;
  server_name fin4x;
  location / {
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  Host       $http_host;
    proxy_pass        http://127.0.0.1:3000;
  }
}
```
```sh
sudo ln -s /etc/nginx/sites-available/fin4x /etc/nginx/sites-enabled/fin4x
sudo service nginx restart
```
