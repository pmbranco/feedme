console.log("starting loading")

// var React = require('react')

// console.log("loaded react")

var Button = require('./Buttons.jsx')

var Order = require('./Order.jsx')

var OrderLine = require('./OrderLine.jsx')

var OrderLineList = require('./OrderLineList.jsx')

var OrderLineForm = require('./OrderLineForm.jsx')


ReactDOM.render(
    <Order apiroot={"../feedme-api/"} url={"/feedme-api/orderlines/?order=" + order} />,
    document.getElementById("feedme-main")
);