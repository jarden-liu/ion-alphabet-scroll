ion-alphabet-scroll
================

> A list of similar contacts, which can quickly find items through the alphabetical index.

- [Installation](#installation)
- [Usage](#usage)
- [Configure](#Configure)

# Installation

1. Use bower to install:
```bash
bower install ion-alphabet-scroll --save
```

2. Import javascript and css file into your index.html:
```html
<script src="lib/ion-alphabet-scroll/src/ion-alphabet-scroll.js"></script>
<link href="lib/ion-alphabet-scroll/src/ion-alphabet-scroll.css" rel="stylesheet">
```

3. Import the `ion-alphabet-scroll` to your Ionic App
```javascript
angular.module('app', [
  'ionic',
  'ion-alphabet-scroll'
]);
```

# Usage

Add `ion-alphabet-scroll` into your template , but it 'must be under the ion-content'.
#Example
```html
<ion-alphabet-scroll ng-model="listModel"  key="keyName">
      <div>Name: {{item.name}}</div>
</ion-alphabet-scroll>
```
this 'ng-model' is the model you would like to sort .

the 'key' is the name of the key would like to order by.

ps:Don't set ion-content scroll='false' .


# Configure

If you don't want to sort your data lists , you can set 'sort="false"'. Default is true .
```html
<ion-alphabet-scroll ng-model="listModel"  key="keyName" sort="false">
      <div>Name: {{item.name}}</div>
</ion-alphabet-scroll>
```

At the same time, you can also adjust the location of the alpha sidebar, through the next few properties:

```bash
 1.header-height
 2.subHeader-height
 3.tab-height
```
the 'header-height' is your app header height.Default is 48px. 

the 'subHeader-height' is the subHeader height.Default is 44px. 

the 'tab-height' is the bottom tab height.Default is 50px. 
```html
<ion-alphabet-scroll ng-model="listModel"  key="keyName" sort="false" header-height="48px">
      <div>Name: {{item.name}}</div>
</ion-alphabet-scroll>
```



