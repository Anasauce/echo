export default function escapeMarkdownLinkTitle(title) {
  return title.replace('[', '(').replace(']', ')')
}
