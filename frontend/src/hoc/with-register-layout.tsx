import React, { Component } from 'react';
import { setOrGetStore } from '@/util/initialise-store';
import verifyToken from '@/util/verify-token';
import verifyEmail from '@/util/verify-email';
import { RootState } from '@/store';

type Props = {
  reduxState?: RootState;
};

const WithRegisterLayout = (App) => {
  return class AppWithRegisterLayout extends Component<Props> {
    constructor(props) {
      super(props);
    }

    static async getInitialProps(ctx) {
      let appProps = {};

      const { token, email, boardId } = ctx.query;
      if (token && email && boardId) {
        // If token is invalid then redirect to error page
        const isTokenValid = await verifyToken(ctx);

        if (!isTokenValid) {
          if (ctx.res) {
            // Server-side redirect
            ctx.res.writeHead(307, {
              Location: '/error'
            });
            ctx.res.end();
          } else if (typeof window !== 'undefined') {
            // Client-side redirect
            window.location.href = '/error';
          }
          return { ...appProps };
        }

        // If the invited user is a registered user
        const isExistingUser = await verifyEmail(ctx);

        if (isExistingUser) {
          if (ctx.res) {
            // Server-side redirect
            ctx.res.writeHead(307, {
              Location: `/login?token=${token}&email=${email}&boardId=${boardId}`
            });
            ctx.res.end();
          } else if (typeof window !== 'undefined') {
            // Client-side redirect
            window.location.href = `/login?token=${token}&email=${email}&boardId=${boardId}`;
          }
          return { ...appProps };
        }
      }

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      const reduxStore = setOrGetStore(ctx.reduxState);

      ctx.reduxState = reduxStore.getState();

      return {
        ...appProps,
        reduxState: reduxStore.getState()
      };
    }

    render() {
      const { reduxState, ...rest } = this.props;
      return <App {...rest} />;
    }
  };
};

export default WithRegisterLayout;
