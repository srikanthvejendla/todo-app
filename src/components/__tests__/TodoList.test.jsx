import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoList from '../TodoList'

describe('TodoList', () => {
    const mockTodos = [
        { id: 1, text: 'Test todo 1', completed: false },
        { id: 2, text: 'Test todo 2', completed: true }
    ]
    
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    it('renders list of todos', () => {
        render(
            <TodoList 
                todos={mockTodos}
                onToggleTodo={mockToggle}
                onDeleteTodo={mockDelete}
            />
        )
        
        expect(screen.getByText('Test todo 1')).toBeInTheDocument()
        expect(screen.getByText('Test todo 2')).toBeInTheDocument()
    })

    it('renders empty message when no todos', () => {
        render(
            <TodoList 
                todos={[]}
                onToggleTodo={mockToggle}
                onDeleteTodo={mockDelete}
            />
        )
        
        expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument()
    })
}) 