import {BrowserRouter, Route,Switch } from 'react-router-dom';
import { AuthcontextProvider } from './contexts/Authcontext';
import { Home } from './pages/Home';
import { NewRoom } from "./pages/NewRoom";
import {Room} from './pages/Room';

function App() {
 
  return (
     <BrowserRouter>
      <AuthcontextProvider>
        
        <Route path="/" exact component = {Home}/>
        < Route path = "/rooms/new"  exact component = {NewRoom}/>
        <Route path = "/rooms/:id"  exact component = {Room}/>
        
      </AuthcontextProvider>
     </BrowserRouter>
      
  );
}

export default App;