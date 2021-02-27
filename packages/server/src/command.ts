import { Command as OclifCommand } from '@oclif/command'
import Enquirer from 'enquirer'

export abstract class Command extends OclifCommand {
  protected enquirer = new Enquirer()
}
