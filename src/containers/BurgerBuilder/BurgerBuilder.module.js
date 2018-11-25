import React, { Component } from 'react';
import axios from '../../axios-orders';

import Burger from '../../components/Burger/Burger.module';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.module';
import Modal from '../../components/UI/Modal/Modal.module';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.module';
import Spinner from '../../components/UI/Spinner/Spinner.module';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler.module';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.7,
  meat: 1.3,
  bacon: 0.6
}

class BuilderBurger extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(res => this.setState({ingredients: res.data}))
      .catch(e => this.setState({error: true}))
  }

  updatePurchaseState(ingredients) {

    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    })
    .reduce((sum, el) => {
      return sum + el
    }, 0)

    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updateCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updateCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updateCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Antonio',
        address: {
          street: 'Test Street 1',
          zipCode: 'UK1234',
          country: 'UK'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'oneDay'
    }
    axios.post('/orders.json', order)
      .then(() => this.setState({ loading: false, purchasing: false }))
      .catch(e => {
        this.setState({ loading: false, purchasing: false });
        console.log(e);
      });
  }

  render () {
    const disableInfo = {
      ...this.state.ingredients
    };
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Error in fetching the ingredients!</p> : <Spinner />
    
    if (this.state.ingredients) {
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} 
      />

      burger = (
        <>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler} 
            ingredientRemoved={this.removeIngredientHandler} 
            disabled={disableInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice} />
        </>
      )
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </>
    )
  }
}

export default withErrorHandler(BuilderBurger, axios);