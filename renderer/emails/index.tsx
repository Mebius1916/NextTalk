import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PlaidVerifyEmailProps {
  validationCode?: string;
  username:string;
}
export const PlaidVerifyEmail = ({
  validationCode,
  username,
}: PlaidVerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://thirdqq.qlogo.cn/ek_qqapp/AQA8HMibPTWmgmePicVCMC67iazvTh853mQxj1oU4G2985qBhxkoiaPILAs1xnEX4QF25y2kuiaNMHfCXfice8P2LBTvnJrhZuPqKQ5JdRSNicmFA2kt0BBwnM/0"
          width="50"
          height="50"
          alt="Plaid"
          style={logo}
        />
        <Text style={tertiary}>Verify Your Identity</Text>
        <Heading style={secondary}>
          Hello {username}
        </Heading>
        <Section style={codeContainer}>
          <Text style={code}>{validationCode}</Text>
        </Section>
        <Text style={paragraph}>Not expecting this email?</Text>
        <Text style={paragraph}>
          Contact{" "}
          <Link href="mailto:login@plaid.com" style={link}>
            591626940@qq.com
          </Link>{" "}
          if you did not request this code.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PlaidVerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "100%",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "0px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "80px 0 80px",

};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "12px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};
