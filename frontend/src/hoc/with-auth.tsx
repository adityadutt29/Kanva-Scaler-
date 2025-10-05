import React, { Component } from 'react';
import { setOrGetStore } from '@/util/initialise-store';
import isValidUser from '@/util/is-valid-user';
import { updateUserData, fetchUser } from '@/slices/user';
import { RootState } from '@/store';

type Props = {
  reduxState?: RootState;
};

const WithAuth = (App) => {
  return class AppWithAuth extends Component<Props> {
    constructor(props) {
      super(props);
    }

    static async getInitialProps(ctx) {
      let appProps = {};

      const reduxStore = setOrGetStore();
      const { dispatch } = reduxStore;

      const userDetails = isValidUser(ctx);

      if (userDetails && !userDetails.isValid) {
        // Only redirect on server-side, on client-side use router
        if (ctx.res) {
          // Server-side redirect
          ctx.res.writeHead(307, {
            Location: '/login'
          });
          ctx.res.end();
        } else if (typeof window !== 'undefined') {
          // Client-side redirect
          window.location.href = '/login';
        }
        return { ...appProps };
      }

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      await dispatch(updateUserData({ type: 'isValid', value: true }));

      if (ctx.req) {
        await dispatch(updateUserData({ type: 'id', value: userDetails && userDetails.id }));
        await dispatch(fetchUser());
      }

      ctx.reduxState = reduxStore.getState();

      return {
        ...appProps
      };
    }

    render() {
      return <App {...this.props} />;
    }
  };
};

export default WithAuth;
