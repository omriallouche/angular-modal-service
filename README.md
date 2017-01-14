# Angular Modal Service
An AngularJS helper service for simple ui-bootstrap modals.
The service allows you to:
 - open a modal using a JS function (e.g. otModalService.showModal("basic")
 - open a modal using URL params (e.g. ?modal=welcome)
 - pass parameters to the modal
 - get data back from the modal
 - run code when the modal is closed

[Demo](http://omriallouche.github.io/angular-modal-service/)

## Getting started:
  - Include [Angular-UI Bootstrap](https://angular-ui.github.io/bootstrap/#/getting_started)
  - Include `otModalService.js`:
```html
<script src="otModalService.js"></script>
```
  - Inject an `otModal` module into your app:
```javascript
angular.module('yourApp', ['otModal']);
```
  - Optionally, you can configure `modalsFolder` and `locationParam` params with `otModalConfigProvider`:
```javascript
myApp.config(["otModalConfigProvider", function (otModalConfigProvider) {
	otModalConfigProvider.config({
		modalsFolder: "%PATH_TO_MODALS_FOLDER%",
		locationParam: "%LOCATION_PARAM%"
	});
}]);
```
## How to use:
 - Open modal with service function
```javascript
otModalService.showModal("basic").then(
    function (modal) {
       console.log('success', modal);
    },
    function (modal) {
        console.log('dismiss', modal);
    }
);
```
 When you call `otModalService.showModal()`, it opens a modal with content read from the template file `otModalConfig.modalsFolder+"/modalName-modal.html"`.
 I.e., when you calling otModalService.showModal("basic") it will open modal with template `"templates/modals/basic-modal.html"`.
 The default value for `otModalConfig.modalsFolder` is `"templates/modals"`.

`otModalService.showModal` returns a Promise object, which is resolved after a call to the function `$ok(successResult)` inside a modal, and is rejected after a call to the function `$cancel(dismissResult)` or when the user clicks on the modal backdrop to close it.
 
 - Open modal with query param
Alternatively, you can use query params in the url.
Adding "?modal=modalName" to the url (after the Hash #) will open a modal with template read from `otModalConfig.modalsFolder + "/modalName-modal.html"`
For example, when the user loads the URL `/index.html?modal=basic`, a modal with template `"templates/modals/basic-modal.html"` will load automatically.
You can configure location parameter for modals opening with `otModalConfigProvider.config` - variable `locationParam` *(`modal` is a default value)*

## Attributes:
`otModalService.showModal(modalName,modalParams)`

- `modalName` - name of the modal. The function will open a modal with template modalName+"-modal.html"
- `modalParams` - accepts any parameter from [ui-bootstrap modal](https://angular-ui.github.io/bootstrap/#/modal),  e.g.
    `{size: "md",animation: false}`

You can also pass data to the modal template using the `resolve` key of the modalParams:
```javascript
var modalParams = {
    resolve: {
        data: function () {
            return "Some test data";
        }
    },
}
```
The passed data can then be accessed in the modal template as `{{data}}`.

When you call the `$ok()` or `$cancel()` functions inside a modal, you can pass any data to `otModalService.showModal()` resolved or rejected promise.
For example, when the user clicks `$ok('Success!')` or `$cancel('Cancelled!')` inside a modal, you get the passed values when `otModalService.showModal` resolves:
```javascript
otModalService.showModal("basic").then(
function (success) {
   console.log('data from modal:', success); // will log 'data from modal: Success!'
},
function (dismiss) {
   console.log('data from modal:', dismiss); // will log 'data from modal: Cancelled!'
});
```

## Contributing
Pull requests are welcome!
