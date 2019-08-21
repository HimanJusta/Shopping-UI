import React, { useState, useEffect} from 'react';
import './App.css';

function transformData(result) {
  const categories = result.map(product => product.category);
  const uniqueCategories = [...new Set(categories)];
  var transformedData = uniqueCategories.map(category => ({
    name: category,
    products: result.filter(product => product.category === category)
  }));
  return transformedData;
}

function App() {
  const [data, setData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [searchVal, setsearchVal] = useState([]);
  const [inStock, setInStock] = useState(false);
  useEffect(() => {
    fetch("http://api.myjson.com/bins/109m7i")
      .then(res => res.json())
      .then(
        (result) => {
          const data = transformData(result);
          setTransformedData(data);
          setData(result);
        },
        (error) => {
          console.error('Error While fetching the data', error);
        }
      )
  }, [data.length]);

  const renderSearchBox = () => {
    return (
      <input
        type="text"
        value={searchVal}
        onChange={(evt) => {
          setsearchVal(evt.target.value);
          setTransformedData(transformData(data.filter(product => product.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1)));
        }}
        placeholder="Search..."
      ></input>
    )
  }

  const renderData = () => {
    return transformedData.map(({name, products}) => {
      return (
        <div key={name} className="content">
          {name}
          <ul>
            {products && products.map(product => {
              return (
                <li className="grid-view" key={product.name}>
                  <span style={!product.stocked ? { color: 'red'} : {}}>{product.name}</span>
                  <span>{product.price}</span>
                </li>
              )
            })}
          </ul>
        </div>
      );
    })
  }

  return (
    <div className="App">
      {renderSearchBox()}
      <label>
        Only show products in stock:
        <input
          name="inStock"
          type="checkbox"
          checked={inStock}
          onChange={(evt) => {
            setInStock(evt.target.checked);
            if (evt.target.checked) {
              setTransformedData(transformData(data.filter(product => product.stocked === evt.target.checked)));
            } else {
              setTransformedData(transformData(data));
            }
          }} />
      </label>
      <div className="grid-view"><span>Name</span><span>Price</span></div>
      {renderData()}
    </div>
  );
}

export default App;
