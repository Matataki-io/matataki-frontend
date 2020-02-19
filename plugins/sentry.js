import Vue from "vue"
import * as Sentry from "@sentry/browser"
import * as Integrations from "@sentry/integrations"

if (process.env.NODE === "production") {
  Sentry.init({
    dsn: "https://c1b6310e663048cc884651886a24a0d8@sentry.io/1885390",
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}
