import React from 'react';
import Button from '../../UI/Button/Button.module';

const orderSummary = (props) => {
  const ingredientsSummary = Object.keys(props.ingredients).map(igKyes => {
    return (
      <li key={igKyes}>
        <span style={{textTransform: 'capitalize'}}>{igKyes}</span>: {props.ingredients[igKyes]}
      </li>
    )
  });
  return (
    <>
      <h3>Your Orders</h3>
      <p>A amazing burger with the following ingredients:</p>
      <ul>
        {ingredientsSummary}
      </ul>
      <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
      <p>Continue to Checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
    </>
  );
}

export default orderSummary;