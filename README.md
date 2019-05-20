# mailgun-sender

A simple node js email sender that uses mailgun

# Install

Clone github repo and install libraries

```console
git clone https://github.com/ezeswci/mailgun-sender.git
cd mailgun-sender
npm i
```

## Configure service:

- As to configure the service copy the json.example files from config folder into new ones. Open a console on projects folder a copy the following codes :

```console
cp config/service.json.example config/service.json
```

And set the correspondent values to your mailgun account

# Run

- Change the file **emails.csv** for the proper csv with emails, email should be first field
- Change the file **template.html** for the proper html template to be sent
- Set the **subject** in **config/service.json**

As to send run:
```console
node index.js
```

- Progress would be shown on console

## Unsubscribe

As to add the link to unsubscribe from email add on HTML template variable %unsubscribe_url%

- HTML example:

```console
<a href="%unsubscribe_url%"> unsubscribe here </a>
```

- More information: https://documentation.mailgun.com/en/latest/api-unsubscribes.html

## Errors

If there are errors, a csv would be created containing the email that generated the error and a details about it.
