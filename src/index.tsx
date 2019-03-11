import React from 'react'
import ReactDOM from 'react-dom'
import immer from 'immer'

interface ProviderState {
  users: string[]
  canEdit: boolean
}

const initialState: ProviderState = {
  users: [],
  canEdit: true,
}

const actions: any = {
  addUser: (state: ProviderState) => {
    state.users.push("")
  },  
  toggleEdit: (state: ProviderState) => {
    state.canEdit = !state.canEdit
  },
  updateUsername: (state: ProviderState, i: number, value: string) => {
    state.users[i] = value
  }  
}

type ProviderStore = [ProviderState, typeof actions]

const StoreContext = React.createContext<ProviderStore>({} as ProviderStore)

interface StoreProviderProps {
  children: React.ReactNode
}

function StoreProvider ({children}: StoreProviderProps) {
  const [state, setState] = React.useState(initialState)
  const immActions: typeof actions | any = {}
  Object.keys(actions).forEach(key => {
    immActions[key] = (...args: any) => setState((old: ProviderState) => immer(old, (draft: ProviderState) => actions[key](draft, ...args)))
  })
  return (
    <StoreContext.Provider value={[state, immActions]}>
      {children}
    </StoreContext.Provider>
  )
}

function UserCount() {
  const [{users}, {addUser}] = React.useContext(StoreContext)
  const count = users.length  
  return React.useMemo(() => {
    return (
      <div style={{padding: 10}}>
        <div>Count: {count}</div>
        <div>
          <button onClick={() => addUser()}>Add user</button>        
        </div>
      </div>
    )
  }, [count])
}

function  CanEdit() {
  const [{canEdit}, {toggleEdit}] = React.useContext(StoreContext)
  return React.useMemo(() => {
    return (
      <div style={{padding: 10}}>
        <div>Can Edit: {canEdit.toString()}</div>
        <div>
          <button onClick={() => toggleEdit()}>Toggle</button>
        </div>
      </div>
    )
  }, [canEdit])
}

function Users() {
  const [{canEdit, users}, {updateUsername}] = React.useContext(StoreContext)
  return React.useMemo(() => {
    return (
      <div style={{padding: 10}}>
        <div>Users</div>
        {
          users.length && users.map((u, i) =>(
            <div key={i}>
              <input 
                value={u} 
                disabled={!canEdit}
                onChange={e => {
                  updateUsername(i, e.target.value)
                }} 
              />
            </div>
          ))
          ||
          <div style={{padding: 10}}>No users added yet</div>
        }
      </div>
    )
  }, [canEdit, users])
}

function Debug() {
  const [state] = React.useContext(StoreContext)
  return (
    <pre>
      <code>{JSON.stringify(state, null, 2)}</code>
    </pre>
  )
}

function App() {
   return (
     <StoreProvider>
        <div className="App">
          <UserCount/>
          <CanEdit/>
          <Users/>
          <Debug/>
        </div>
     </StoreProvider>
   )
}

ReactDOM.render(<App />, document.getElementById('root'))
