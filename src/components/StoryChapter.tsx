import React from 'react';

export type StoryTone = 'teal' | 'blue' | 'amber' | 'coral' | 'slate';

export interface StoryStat {
  label: string;
  value: string;
  detail?: string;
  tone?: StoryTone;
  barValue?: number;
}

export interface StorySignal {
  title: string;
  detail: string;
  badge?: string;
  tone?: StoryTone;
}

export interface StoryMethod {
  eyebrow?: string;
  title: string;
  detail: string;
}

interface StoryChapterProps {
  id: string;
  chapterNumber: number;
  eyebrow: string;
  title: string;
  description: string;
  secondaryText?: string;
  align?: 'left' | 'right' | 'center';
  isActive?: boolean;
  size?: 'narrow' | 'regular' | 'wide';
  stats?: StoryStat[];
  signalsLabel?: string;
  signals?: StorySignal[];
  methods?: StoryMethod[];
  note?: string;
}

function getToneClass(tone: StoryTone = 'slate') {
  return `story-tone story-tone--${tone}`;
}

export function StoryChapter({
  id,
  chapterNumber,
  eyebrow,
  title,
  description,
  secondaryText,
  align = 'left',
  isActive = false,
  size = 'regular',
  stats = [],
  signalsLabel,
  signals = [],
  methods = [],
  note,
}: StoryChapterProps) {
  return (
    <section
      id={id}
      className={`story-chapter story-chapter--${align} ${isActive ? 'is-active' : ''}`}
    >
      <div className={`story-card story-card--${size}`}>
        <div className="story-card__header">
          <span className="story-card__index">{String(chapterNumber).padStart(2, '0')}</span>
          <span className="story-card__eyebrow">{eyebrow}</span>
        </div>

        <h2 className="story-card__title">{title}</h2>

        <p className="story-card__description">{description}</p>
        {secondaryText ? <p className="story-card__secondary">{secondaryText}</p> : null}

        {stats.length > 0 ? (
          <div className="story-stats-grid">
            {stats.map((stat) => (
              <article
                key={`${id}-${stat.label}`}
                className={`story-stat ${getToneClass(stat.tone)}`}
              >
                <span className="story-stat__label">{stat.label}</span>
                <strong className="story-stat__value">{stat.value}</strong>
                {typeof stat.barValue === 'number' ? (
                  <span className="story-stat__bar">
                    <span
                      className="story-stat__bar-fill"
                      style={{ width: `${Math.max(0, Math.min(100, stat.barValue * 100))}%` }}
                    />
                  </span>
                ) : null}
                {stat.detail ? <span className="story-stat__detail">{stat.detail}</span> : null}
              </article>
            ))}
          </div>
        ) : null}

        {signals.length > 0 ? (
          <div className="story-subsection">
            {signalsLabel ? <span className="story-subsection__label">{signalsLabel}</span> : null}
            <div className="story-signal-list">
              {signals.map((signal) => (
                <article
                  key={`${id}-${signal.title}`}
                  className={`story-signal ${getToneClass(signal.tone)}`}
                >
                  <div className="story-signal__copy">
                    <strong className="story-signal__title">{signal.title}</strong>
                    <p className="story-signal__detail">{signal.detail}</p>
                  </div>
                  {signal.badge ? <span className="story-signal__badge">{signal.badge}</span> : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {methods.length > 0 ? (
          <div className="story-subsection">
            <div className="story-method-list">
              {methods.map((method) => (
                <article key={`${id}-${method.title}`} className="story-method">
                  <span className="story-method__marker" />
                  <div className="story-method__copy">
                    {method.eyebrow ? (
                      <span className="story-method__eyebrow">{method.eyebrow}</span>
                    ) : null}
                    <strong className="story-method__title">{method.title}</strong>
                    <p className="story-method__detail">{method.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {note ? <p className="story-card__note">{note}</p> : null}
      </div>
    </section>
  );
}
