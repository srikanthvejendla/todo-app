import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoItem from '../TodoItem'

describe('TodoItem', () => {
    const mockTodo = {
        id: 1,
        text: 'Test todo',
        completed: false
    }
    
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    it('renders todo item', () => {
        render(
            <TodoItem 
                todo={mockTodo}
                onToggle={mockToggle}
                onDelete={mockDelete}
            />
        )
        
        expect(screen.getByText('Test todo')).toBeInTheDocument()
    })

    it('calls onToggle when checkbox is clicked', () => {
        render(
            <TodoItem 
                todo={mockTodo}
                onToggle={mockToggle}
                onDelete={mockDelete}
            />
        )
        
        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)
        expect(mockToggle).toHaveBeenCalledWith(mockTodo.id)
    })

    it('calls onDelete when delete button is clicked', () => {
        render(
            <TodoItem 
                todo={mockTodo}
                onToggle={mockToggle}
                onDelete={mockDelete}
            />
        )
        
        // Get all buttons and find the delete button by its class
        const buttons = screen.getAllByRole('button')
        const deleteButton = buttons.find(button => 
            button.className.includes('hover:text-red-500')
        )
        
        fireEvent.click(deleteButton)
        expect(mockDelete).toHaveBeenCalledWith(mockTodo.id)
    })
}) 