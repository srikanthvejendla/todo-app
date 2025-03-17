import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from '../AddTodo';

describe('AddTodo', () => {
  it('renders input and button', () => {
    render(<AddTodo onAdd={() => {}} />);
    
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls onAdd with input text when form is submitted', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
    expect(input.value).toBe(''); // Input should be cleared
  });
}); 