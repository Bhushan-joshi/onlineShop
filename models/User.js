const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    Cart: {
        items: [{
            productid: { type: Schema.Types.ObjectId ,ref:'Product'  },
            quantity: { type: Number, required:true},
        }]
    }
});

UserSchema.methods.addToCart=function(prodid){
  const cartProductIndex = this.Cart.items.findIndex(cp => {
    return cp.productid.toString() === prodid._id.toString();
  });
      let newQuantity = 1;
      let updatedCartItems = [...this.Cart.items];
    
      if (cartProductIndex >= 0) {
        newQuantity = this.Cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productid: prodid._id,
          quantity: newQuantity
        });
      }
      const updatedCart = {
        items: updatedCartItems
      };
      this.Cart = updatedCart;
      return this.save();
};
UserSchema.methods.removeCartItem = function(productId) {
  const updatedCartItems = this.Cart.items.filter(item => {
    return item.productid.toString() !== productId.toString();
  });
  this.Cart.items = updatedCartItems;
  return this.save();
};

UserSchema.methods.clearCart=function(){
  this.Cart={items:[]};
  return this.save();
};
module.exports = mongoose.model('User', UserSchema);