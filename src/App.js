import * as React from "react";
import axios from "axios";
import {
  AppProvider,
  Page,
  ColorPicker,
  Card,
  TextField,
  hsbToRgb,
  Button,
  Form,
  FormLayout,
  FooterHelp,
  Link,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "./App.css";

export default function App() {
  const [color, setColor] = React.useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 0.5,
  });
  const [quote, setQuote] = React.useState("");
  const [colorString, setColorString] = React.useState("");
  const [fontSize, setFontSize] = React.useState(200);

  const handleQuoteChange = React.useCallback(
    (newValue) => setQuote(newValue),
    []
  );

  const handleDownload = async () => {
    axios({
      url: `/api/quote/download/${quote}/${colorString}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quote.png");
      document.body.appendChild(link);
      link.click();
    });
  };

  React.useEffect(() => {
    const alpha = Math.round((color.alpha + Number.EPSILON) * 10) / 10;
    const { red, green, blue } = hsbToRgb(color);
    setColorString(`rgba(${red}, ${green}, ${blue}, ${alpha})`);
    if (quote.length < 25) {
      setFontSize(150);
    } else if (quote.length < 75) {
      setFontSize(100);
    } else {
      setFontSize(75);
    }
  }, [color, quote]);

  return (
    <AppProvider i18n={enTranslations} features={{ newDesignLanguage: true }}>
      <Page title="Create Quote">
        <Form>
          <FormLayout>
            <Card>
              <Card.Section>
                <TextField
                  label="Enter Your Quote:"
                  value={quote}
                  onChange={handleQuoteChange}
                  autoComplete="off"
                  placeholder="Type here"
                  maxLength="100"
                />
              </Card.Section>
              <Card.Section>
                <ColorPicker allowAlpha color={color} onChange={setColor} />
              </Card.Section>
              <Card.Section>
                <div
                  className="quote-image"
                  style={{
                    color: colorString,
                    fontSize: fontSize,
                  }}
                >
                  {quote}
                </div>
              </Card.Section>
              <Card.Section>
                {quote ? (
                  <Button onClick={handleDownload}>Download</Button>
                ) : (
                  <Button disabled>Download</Button>
                )}
              </Card.Section>
            </Card>
          </FormLayout>
        </Form>
        <FooterHelp>
          Frontend:
          <Link url="https://github.com/abhishekmthw/quote-creator-frontend">
            Go to repository
          </Link>{" "}
          Backtend:
          <Link url="https://github.com/abhishekmthw/quote-creator-backend">
            Go to repository
          </Link>
        </FooterHelp>
      </Page>
    </AppProvider>
  );
}
