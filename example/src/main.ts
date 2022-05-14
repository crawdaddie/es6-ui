import './style.css'
import App from './app'
import { mount } from '../../src/component'

const root = document.querySelector<HTMLDivElement>('#app')!
mount(root, App())

