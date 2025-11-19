import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

function Hello({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

describe('Hello Component', () => {
  it('renders greeting', () => {
    render(<Hello name="World" />);
    const heading = screen.getByText('Hello, World!');
    expect(heading).toBeTruthy();
  });
});
