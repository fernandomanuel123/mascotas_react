import {Routes, Route, BrowserRouter} from 'react-router-dom'
import  ShowMascotas from './components/ShowMascotas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element = {<ShowMascotas></ShowMascotas>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
