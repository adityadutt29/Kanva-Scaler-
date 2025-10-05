import React, { Component } from 'react';
import { setOrGetStore } from '@/util/initialise-store';
import { fetchBoards } from '@/slices/boards';
import { RootState } from '@/store';

type Props = {
  reduxState?: RootState;
};

const WithBoardsLayout = (App) => {
  return class AppWithBoardsLayout extends Component<Props> {
    constructor(props) {
      super(props);
    }

    static async getInitialProps(ctx) {
      let appProps = {};

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      const reduxStore = setOrGetStore(ctx.reduxState);
      const { dispatch } = reduxStore;

      await dispatch(fetchBoards());

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

export default WithBoardsLayout;
