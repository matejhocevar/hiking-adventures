export default function MarkdownInstructions() {
  return (
    <div style={{ marginTop: "5rem" }}>
      <h3>Editor instructions</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Element</th>
            <th>Syntax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Heading</td>
            <td>
              <code>
                # H1
                <br />
                ## H2
                <br />
                ### H3
              </code>
            </td>
          </tr>
          <tr>
            <td>Bold</td>
            <td>
              <code>**bold text**</code>
            </td>
          </tr>
          <tr>
            <td>talic</td>
            <td>
              <code>*italicized text*</code>
            </td>
          </tr>
          <tr>
            <td>Blockquote</td>
            <td>
              <code>&gt; blockquote</code>
            </td>
          </tr>
          <tr>
            <td>Ordered List</td>
            <td>
              <code>
                1. First item
                <br />
                2. Second item
                <br />
                3. Third item
                <br />
              </code>
            </td>
          </tr>
          <tr>
            <td>Unordered List</td>
            <td>
              <code>
                - First item
                <br />
                - Second item
                <br />
                - Third item
                <br />
              </code>
            </td>
          </tr>
          <tr>
            <td>Code</td>
            <td>
              <code>`code`</code>
            </td>
          </tr>
          <tr>
            <td>Horizontal Rule</td>
            <td>
              <code>---</code>
            </td>
          </tr>
          <tr>
            <td>Link</td>
            <td>
              <code>[title](https://www.example.com)</code>
            </td>
          </tr>
          <tr>
            <td>Image</td>
            <td>
              <code>![alt text](image.jpg)</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
