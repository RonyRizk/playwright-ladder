// A Page Object: ONE place that knows how to find things on the task screen.
class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTask = page.getByLabel('New task');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
    this.counter = page.getByTestId('counter');
    this.items = page.getByRole('listitem');
  }

  async goto() {
    await this.page.goto('/');
  }

  item(title) {
    return this.items.filter({ hasText: title });
  }

  async add(title) {
    await this.newTask.fill(title);
    await this.addButton.click();
  }

  async complete(title) {
    await this.item(title).getByRole('checkbox').check();
  }

  async remove(title) {
    await this.item(title).getByRole('button', { name: 'Delete' }).click();
  }
}

module.exports = { TodoPage };
