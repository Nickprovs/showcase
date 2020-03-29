import { useEffect } from 'react'
import Router from 'next/router'
import { getCurrentUserAsync } from "../../services/userService";

const withAuthSync = (WrappedComponent, redirect = false, redirectUri = "/login") => {
    const Wrapper = props => {
      const syncLogout = event => {
        if (event.key === 'logout') {
          console.log('logged out from storage!')
          Router.push('/login')
        }
      }
  
      useEffect(() => {
        window.addEventListener('storage', syncLogout)
  
        return () => {
          window.removeEventListener('storage', syncLogout)
          window.localStorage.removeItem('logout')
        }
      }, [])
  
      return <WrappedComponent {...props} />
    }
  
    Wrapper.getInitialProps = async ctx => {
        let user = null;
        let authIssue = false; 
        try{         
            const res = await getCurrentUserAsync(ctx);
            if(res.status === 200){
              user = await res.json();
              console.log("got user");
            }
            else{
              authIssue = true;
              console.log("couldn't get user");
            }
        }
        catch(ex){
            console.log(ex);
            authIssue = true;
            console.log("couldn't get user");
        }

        if(authIssue && redirect){
          //Server
          if(ctx.req){
            console.log("YOOOO");
            ctx.res.writeHead(301, { Location: redirectUri });
            ctx.res.end();
          }         
          //Client
          else
            Router.push(redirectUri)     
        }
  
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))
  
      return { ...componentProps, user }
    }
  
    return Wrapper
}

export default withAuthSync;
