var Order = React.createClass({
  loadOrder: function(orderid) {
    $.ajax({
      url: api_base + 'orders/' + orderid,
      dataType: 'json',
      success: function(success) {
        this.setState({order: success})
        this.setState({restaurant: success.restaurant})
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(xhr, status, err)
      }.bind(this)
    })
  },

  loadOrderLines: function(path) {
      $.ajax({
      url: path || this.props.url,
      dataType: 'json',
      cache: false,
      success: function(success) {
        var data = this.state.data;
        for (var attrname in success.results) {data[success.results[attrname].id] = success.results[attrname]; }
        this.setState({data: data});
        if (success.next != null) {
            this.loadOrderLines(success.next)
        }
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(xhr, status, error)
      }.bind(this)
    });
  },

  handleOrderLineSubmit: function(orderline) {
    // Submit to server and refresh list
    orderline.csrfmiddlewaretoken = csrftoken;
    orderline.order = order;
    var shouldPut = orderline.id !== ""
    $.ajax({
        url: api_base + "orderlines/" + (shouldPut ? orderline.id : ''),
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        },
        dateType: 'json',
        type: shouldPut ? 'PUT' : 'POST',
        data: orderline,
        success: function(response) {
            if (shouldPut) {
                var data = this.state.data
                for (var attrname in response) {data[response[attrname].id] = response[attrname]; }
                this.setState({data: data})
                $("#orderline-" + response.id).removeClass("hide") // hacky way to show it again afterwards
            } else {
                this.setState({data: this.state.data.concat(response)})
            }
        }.bind(this),
        error: function(xhr, status, error) {
            console.error(xhr, status, error)
        }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      data: [],
      order: {},
      restaurant: {restaurant_name: ''}
    }
  },

  componentDidMount: function() {
    this.loadOrder(this.props.orderid)
    this.loadOrderLines()
  },

  render: function() {
    var that = this
    var Menu = React.createClass({
      render: function () {
        return (
          <span>
            <i className="fa fa-cutlery"></i> <a href={that.state.restaurant.menu_url}>Menu</a>
          </span>
        )
      }
    })
    var Phone = React.createClass({
      render: function () {
        return (
          <span>
            <i className="fa fa-phone"></i> <a href={"tel:" + that.state.restaurant.phone_number}>{that.state.restaurant.phone_number}</a>
          </span>
        )
      }
    })

    return (
      <div className="container order">
        <div className="row">
          <h1>Feedme</h1>
          <h2>
              {this.state.restaurant.restaurant_name} &nbsp;
              <small>
                <Menu /> &nbsp;
                <Phone />
              </small>
          </h2>
          <OrderLineList
              apiroot={this.props.apiroot}
              data={this.state.data}
              url={this.props.url}
              extra_costs={this.state.order.extra_costs}
              />
          <OrderLineForm onOrderLineSubmit={this.handleOrderLineSubmit} />
        </div>
      </div>
    );
  }
});

window.Order = Order
module.exports = Order
