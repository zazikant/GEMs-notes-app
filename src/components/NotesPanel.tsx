'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { PALETTE, Note } from '@/types';
import { relDate } from '@/lib/utils';

const PAGE_SIZE = 20;

export function NotesPanel() {
  const { filteredNotes, activeId, openNote, sortMode, setSortMode } = useNotes();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredNotes.length, sortMode]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredNotes.length));
      setIsLoading(false);
    }, 150);
  }, [filteredNotes.length]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < filteredNotes.length && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredNotes.length, isLoading, loadMore]);

  const visibleNotes = filteredNotes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotes.length;

  return (
    <div className="notes-panel">
      <div className="panel-header">
        <span className="panel-title">Notes</span>
        <span className="notes-count" id="listCount">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
        </span>
        <select
          className="sort-select"
          value={sortMode}
          onChange={e => setSortMode(e.target.value as 'newest' | 'oldest' | 'ticker')}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="ticker">Ticker A–Z</option>
        </select>
      </div>
      <div className="notes-list" id="notesList">
        {filteredNotes.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '13px', fontFamily: 'Syne, sans-serif' }}>
            No notes found
          </div>
        ) : (
          <>
            {visibleNotes.map(note => (
              <NoteCard key={note.id} note={note} isActive={note.id === activeId} onClick={() => openNote(note.id)} />
            ))}
            {hasMore && (
              <div ref={loadMoreRef} className="load-more-trigger">
                {isLoading && (
                  <div className="load-more-spinner">
                    <span>Loading...</span>
                  </div>
                )}
              </div>
            )}
            {!hasMore && filteredNotes.length > PAGE_SIZE && (
              <div className="all-loaded-msg">
                All {filteredNotes.length} notes loaded
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

function NoteCard({ note, isActive, onClick }: NoteCardProps) {
  const { getTag, getTagColor } = useNotes();

  return (
    <div className={`note-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="note-card-top">
        <span className="note-ticker">{note.ticker || '—'}</span>
        <span className="note-date-small">{relDate(note.created)}</span>
      </div>
      <div className="note-preview">
        {note.body || <span style={{ color: 'var(--border)' }}>No content</span>}
      </div>
      <div className="note-tags-row">
        {note.tags.map(tagId => {
          const tag = getTag(tagId);
          if (!tag) return null;
          const c = getTagColor(tagId);
          return (
            <span key={tagId} className="tag-pill" style={{ background: c.bg, color: c.text }}>
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}