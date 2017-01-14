# otModalService
An AngularJS helper service for simple ui-bootstrap modals.

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
});
```
 When you call `otModalService.showModal`, it will open modal with template `otModalConfig.modalsFolder+"/modalName-modal.html"`. I.e., when you calling otModalService.showModal("basic") it will open modal with template `"templates/modals/basic-modal.html"`. `otModalConfig.modalsFolder`default value is `"templates/modals"`.
`otModalService.showModal` returns a Promise object, which will be resolved after calling function `$ok(successResult)` inside a modal, and it will be rejected after calling function `$cancel(dismissResult)` or when user click on modal backdrop.
 
 - Open modal with query param
You can just open URL with query param "?modal=modalName" and it will show  it will open modal with template `otModalConfig.modalsFolder+"/modalName-modal.html"`
I.e., when you opened URL `/index.html?modal=basic` it will open modal with template `"templates/modals/basic-modal.html"`. 
You can configure location parameter for modals opening with `otModalConfigProvider.config` - variable `locationParam` *(`modal` is a default value)*

## Attributes:
`otModalService.showModal(modalName,modalParams)`

`modalName` - this function will open modal with template `otModalConfig.modalsFolder+"/"+modalName+"-modal.html"` 

`modalParams` - you can pass any params from [ui-bootstrap modal](https://angular-ui.github.io/bootstrap/#/modal),  i.e.
`var params = {size: "md",animation: false}`

Also, you can pass data, which you can send to modal template:
```javascript
var modalParams = {
    resolve: {
        data: function () {
            return "Some test data";
        }
    },
}
```
It can be accessed in modal template with `{{data}}`.

When you calling `$ok()` or `$cancel()` function inside a modal, you can pass any data to `otModalService.showModal` resolved or rejected promise.
I.e. when user clicked `$ok('Success!')` or `$cancel('Cancelled!')` inside a modal, you can get this data when `otModalService.showModal` will be resolved:
```javascript
otModalService.showModal("basic").then(
function (success) {
   console.log('data from modal:', success);
   /*should be 'data from modal: Success!'*/
},
function (dismiss) {
   console.log('data from modal:', dismiss);
   /*should be 'data from modal: Cancelled!'*/
});
```


