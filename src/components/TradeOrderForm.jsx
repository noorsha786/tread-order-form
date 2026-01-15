import React, { useMemo, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTrade } from '../features/trade/tradeThunks';
import { resetTrade } from '../features/trade/tradeSlice';
import tickerData from '../public/validate-ticker.json.json'
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const initialState = {
    ticker: '',
    orderType: '',
    quantity: '',
    limitPrice: '',
    errors: {},
    tickerValid: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
                errors: { ...state.errors, [action.field]: null },
            };
        case 'SET_ERROR':
            return {
                ...state,
                errors: { ...state.errors, [action.field]: action.error },
            };
        case 'RESET':
            return initialState;
        case 'SET_TICKER_VALID':
            return { ...state, tickerValid: action.value };
        default:
            return state;
    }
}

export default function TradeOrderForm() {
    const [state, dispatchForm] = useReducer(reducer, initialState);
    const reduxDispatch = useDispatch();
    const { loading, success } = useSelector(s => s.trade);

    const debouncedTicker = useDebouncedValue(state.ticker, 500);

    useEffect(() => {
        if (!debouncedTicker) return;
        // console.log(tickerData)
        dispatchForm({
            type: 'SET_TICKER_VALID',
            value: tickerData.validTickers.includes(debouncedTicker),
        })
        // fetch('/validate-ticker.json')
        //     .then(res => res.json())
        //     .then(data => {
        //         dispatchForm({
        //             type: 'SET_TICKER_VALID',
        //             value: data.validTickers.includes(debouncedTicker),
        //         });
        //     });
    }, [debouncedTicker]);

    const totalValue = useMemo(() => {
        return state.quantity && state.limitPrice
            ? Number(state.quantity) * Number(state.limitPrice)
            : 0;
    }, [state.quantity, state.limitPrice]);

    const handleSubmit = e => {
        e.preventDefault();

        if (!state.ticker) {
            dispatchForm({ type: 'SET_ERROR', field: 'ticker', error: 'Ticker Required.' });
            return;
        }

        if(!state.orderType){
            dispatchForm({ type: 'SET_ERROR', field: 'orderType', error: 'Order Type Required.' });
            return;
        }

        if(!state.quantity){
            dispatchForm({ type: 'SET_ERROR', field: 'quantity', error: 'Quantity Required.' });
            return;
        }

        if(!state.limitPrice && state.orderType === 'LIMIT'){
            dispatchForm({ type: 'SET_ERROR', field: 'limitPrice', error: 'Limit Price Required.' });
            return;
        }

        reduxDispatch(submitTrade(state));
    };

    useEffect(() => {
        if (success) {
            dispatchForm({ type: 'RESET' });
            reduxDispatch(resetTrade());
        }
    }, [success, reduxDispatch]);

    return (
        <form onSubmit={handleSubmit}>
              <label>Ticker: </label>
                <input
                    placeholder="Ticker"
                    value={state.ticker}
                    onChange={e =>
                        dispatchForm({
                            type: 'SET_FIELD',
                            field: 'ticker',
                            value: e.target.value.toUpperCase(),
                        })
                    }
                />
                {state.ticker && state.tickerValid === false && <span>Invalid Ticker</span>}
                {state?.errors?.ticker && <span className='danger'>{state?.errors?.ticker}</span>}
            <br/> <br/>
                <label>Order Type: </label>
                <select
                    data-testid="order-type"
                    value={state.orderType}
                    onChange={e =>
                        dispatchForm({ type: 'SET_FIELD', field: 'orderType', value: e.target.value })
                    }
                >
                    <option value="">Select</option>
                    <option value="LIMIT" data-testid="order-type-limt">Limit</option>
                    <option value="MARKET">Market</option>
                    <option value="STOP">Stop Loss</option>
                </select>
                {state?.errors?.orderType && <span className='danger'>{state?.errors?.orderType}</span>}
            
            <br/> <br/>
                <label>Quantity</label>
                <input
                    type="number"
                    placeholder="Quantity"
                    value={state.quantity}
                    onChange={e =>
                        dispatchForm({ type: 'SET_FIELD', field: 'quantity', value: e.target.value })
                    }
                />
                {state?.errors?.quantity && <span className='danger'>{state?.errors?.quantity}</span>}
            <br/> <br/>
                {state.orderType === 'LIMIT' && (
                    <>
                        <label>Limit Price:</label>
                        <input
                        type="number"
                        data-testid="Limit-price"
                        placeholder="Limit Price"
                        value={state.limitPrice}
                        onChange={e =>
                            dispatchForm({
                                type: 'SET_FIELD',
                                field: 'limitPrice',
                                value: e.target.value,
                            })
                        }
                        />
                    </>
                    
                )}
                {state?.errors?.limitPrice && <span className='danger'>{state?.errors?.limitPrice}</span>}
            

            <div>Total Estimated Value: ${totalValue}</div>
<br/>
            {totalValue > tickerData?.buyingPower && <div className='danger'>Exceeds Buying Power</div>}
            <br/>
            <button>
                {loading ? 'Processing...' : 'Submit'}
            </button>

            {success && <p>Trade Submitted Successfully</p>}
        </form>
    );
}
