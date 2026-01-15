import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradeOrderForm from '../components/TradeOrderForm';
import { renderWithRedux } from '../test-utils/testUtils';
import { act } from 'react';
import '@testing-library/jest-dom'
  
test('Error messages are shown for inputs', async () => {
    renderWithRedux(<TradeOrderForm />);
    // Ticker field
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/Ticker Required./i)).toBeInTheDocument();
    let tickerInput = screen.getByPlaceholderText(/ticker/i);
    await userEvent.type(tickerInput, 'aapl');
    
    // Order Type field
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/Order Type Required./i)).toBeInTheDocument();
    let orderTypeSelect = await screen.getByTestId('order-type');
    await userEvent.selectOptions(orderTypeSelect, 'LIMIT');
    
    // Quantity field
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/Quantity Required./i)).toBeInTheDocument();
})

test('Show Limit Price field only when order type is LIMIT', async () => {
    renderWithRedux(<TradeOrderForm />);

    await userEvent.selectOptions(screen.getByTestId("order-type"), 'LIMIT');

    const limitPriceInput = await screen.findByTestId('Limit-price');
    expect(limitPriceInput).toBeInTheDocument();
})

test('Showing invalid ticket error message', async () => {
    jest.useFakeTimers();

    renderWithRedux(<TradeOrderForm />);

    let tickerInput = screen.getByPlaceholderText(/ticker/i);
    await userEvent.type(tickerInput, 'gggg');

    expect(
        screen.queryByText(/invalid ticker/i)
    ).not.toBeInTheDocument();

    await act(async () => {
        jest.advanceTimersByTime(500);
    });

    expect(
        screen.getByText(/Invalid Ticker/i)
    ).toBeInTheDocument();

    jest.useRealTimers();
})

test('Exceeds Buying Power validation', async () => {
    renderWithRedux(<TradeOrderForm />);
    await userEvent.selectOptions(screen.getByTestId('order-type'), 'LIMIT');
    await userEvent.type(screen.getByPlaceholderText(/quantity/i), '20000');

    const limitPriceInput = await screen.findByTestId('Limit-price');
    await userEvent.type(limitPriceInput, '2000');
    expect(
       await screen.getByText(/Exceeds Buying Power/i) // 2000 * 20000 = 40000000
    ).toBeInTheDocument();

})

test('User filling the form and submitting the data', async () => {
    renderWithRedux(<TradeOrderForm />);

    expect(
        screen.queryByTestId('Limit-price')
    ).not.toBeInTheDocument();

    let tickerInput = screen.getByPlaceholderText(/ticker/i);
    let orderTypeSelect = screen.getByTestId('order-type');
    let quantityInput = screen.getByPlaceholderText(/quantity/i);

    await userEvent.type(tickerInput, 'aapl');
    await userEvent.selectOptions(orderTypeSelect, 'LIMIT');
    await userEvent.type(quantityInput, '10');

    expect(tickerInput).toHaveValue('AAPL');
    expect(orderTypeSelect).toHaveValue('LIMIT');
    expect(quantityInput).toHaveValue(10);
});
