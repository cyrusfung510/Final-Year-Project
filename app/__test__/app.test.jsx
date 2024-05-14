// sum.test.js
import { describe, expect, test } from "vitest";
import {render, screen} from '@testing-library/react'

import App from '../src/App';


 it("renders learn react link", () => {
    render(<App/>);

    const linkElement = screen.getByText(
      /Testing 123/i
    );
    expect(linkElement).toBeVisible();
  });
