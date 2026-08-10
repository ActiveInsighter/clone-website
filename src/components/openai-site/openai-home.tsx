"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";

import { OpenAiTopNav } from "./openai-top-nav";
import {
  openAiFeatureCards,
  openAiFooterGroups,
  openAiPromptSuggestions,
  openAiSections,
} from "./openai-home-data";

const heroPills = [
  { label: "与 ChatGPT 对话", href: "https://chatgpt.com/?mode=voice", external: true },
  { label: "研究", href: "/zh-Hans-CN/research/" },
  { label: "API 平台", href: "/zh-Hans-CN/api/" },
  { label: "客户案例", href: "/zh-Hans-CN/stories/" },
  { label: "更多", href: "/zh-Hans-CN/" },
];

function ExternalIcon() {
  return <ArrowUpRight aria-hidden="true" className="openai-card-external" />;
}

function OpenAiSection({ section }: { section: (typeof openAiSections)[number] }) {
  return (
    <section className="openai-content-section">
      <div className="openai-section-heading">
        <h2>{section.title}</h2>
        <a href={section.linkHref}>
          {section.linkLabel}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <div className="openai-content-grid">
        {section.cards.map((card) => (
          <a className="openai-content-card" href={card.href} key={card.title}>
            <div className="openai-card-media">
              <Image alt="" height={1200} loading="lazy" sizes="(max-width: 900px) 100vw, 33vw" src={card.media} width={1200} />
            </div>
            <div className="openai-card-body">
              <h3>{card.title}</h3>
              <p>{card.meta}</p>
              <ExternalIcon />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function OpenAiHome() {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPromptIndex((index) => (index + 1) % openAiPromptSuggestions.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="openai-page">
      <OpenAiTopNav />

      <main id="main">
        <section className="openai-hero" aria-labelledby="openai-hero-title">
          <div className="openai-hero-inner">
            <h1 id="openai-hero-title">有什么可以帮忙的？</h1>
            <div className="openai-composer">
              <span aria-live="polite" className="openai-prompt-text" key={promptIndex}>
                {openAiPromptSuggestions[promptIndex]}
              </span>
              <button aria-label="向 ChatGPT 发送提示" type="button">
                <ArrowUp aria-hidden="true" />
              </button>
            </div>
            <div className="openai-hero-pills">
              {heroPills.map((pill) => (
                <a href={pill.href} key={pill.label} target={pill.external ? "_blank" : undefined}>
                  {pill.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="openai-featured-section" aria-label="精选内容">
          <div className="openai-featured-grid openai-featured-top-grid">
            {openAiFeatureCards.slice(0, 2).map((card) => (
              <a className={`openai-feature-card openai-feature-card-${card.size}`} href={card.href} key={card.title}>
                <div className="openai-feature-media">
                  <Image alt="" height={1200} loading="eager" sizes="(max-width: 900px) 100vw, 66vw" src={card.media} width={1200} />
                </div>
                <div className="openai-feature-copy">
                  <p>{card.meta}</p>
                  <h2>{card.title}</h2>
                  <ExternalIcon />
                </div>
              </a>
            ))}
          </div>
          <div className="openai-featured-grid openai-featured-bottom-grid">
            {openAiFeatureCards.slice(2).map((card) => (
              <a className="openai-feature-card openai-feature-card-small" href={card.href} key={card.title}>
                <div className="openai-feature-media">
                  <Image alt="" height={1200} loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" src={card.media} width={1200} />
                </div>
                <div className="openai-feature-copy">
                  <p>{card.meta}</p>
                  <h2>{card.title}</h2>
                  <ExternalIcon />
                </div>
              </a>
            ))}
          </div>
        </section>

        {openAiSections.map((section) => (
          <OpenAiSection key={section.title} section={section} />
        ))}

        <section className="openai-start-section">
          <div className="openai-start-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2>开始使用 ChatGPT</h2>
          <Link className="openai-pill-button openai-cta-button" href="/zh-Hans-CN/chatgpt/download/">
            下载
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="openai-footer">
        <div className="openai-footer-grid">
          {openAiFooterGroups.map((group) => (
            <div className="openai-footer-group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link}>
                    <Link href="/zh-Hans-CN/">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="openai-footer-bottom">
          <span>OpenAI © 2015–2026</span>
          <div className="openai-social-links">
            <a href="https://x.com/OpenAI" target="_blank">X</a>
            <a href="https://www.youtube.com/OpenAI" target="_blank">YouTube</a>
            <a href="https://www.linkedin.com/company/openai" target="_blank">LinkedIn</a>
            <a href="https://github.com/openai" target="_blank">GitHub</a>
            <a href="https://www.instagram.com/openai/" target="_blank">Instagram</a>
          </div>
          <button type="button">管理 Cookie</button>
          <button type="button">中文 · 中国</button>
        </div>
      </footer>
    </div>
  );
}
